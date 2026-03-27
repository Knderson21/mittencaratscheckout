import {useRef, useState} from 'react';
import styles from './styles.module.scss';

// ProductForm is the shared edit/add form rendered inline in the product list.
//
// Props:
//   formState      - { name, price, stock, image } controlled field values
//   setFormState   - setter for formState
//   onSave         - called when the user submits the form
//   onCancel       - called when the user dismisses the form
//   onImageUpload  - called with the file input change event
//   fileInputRef   - ref forwarded to the file input for programmatic reset
//   title          - heading shown at the top of the form
const ProductForm = ({
  formState, setFormState, onSave, onCancel, onImageUpload, fileInputRef, title,
}) => (
  <div className={styles.form}>
    <h4 className={styles.formTitle}>{title}</h4>
    <label className={styles.label}>
      Name
      <input
        className={styles.input}
        type="text"
        value={formState.name}
        onChange={(e) => setFormState((p) => ({...p, name: e.target.value}))}
        placeholder="Product name"
      />
    </label>
    <label className={styles.label}>
      Price ($)
      <input
        className={styles.input}
        type="number"
        min="0"
        step="0.01"
        value={formState.price}
        onChange={(e) => setFormState((p) => ({...p, price: e.target.value}))}
        placeholder="0"
      />
    </label>
    <label className={styles.label}>
      Stock
      <input
        className={styles.input}
        type="number"
        min="0"
        step="1"
        value={formState.stock}
        onChange={(e) => setFormState((p) => ({...p, stock: e.target.value}))}
        placeholder="Leave blank for unlimited"
      />
    </label>
    <label className={styles.label}>
      Image
      <input
        ref={fileInputRef}
        className={styles.fileInput}
        type="file"
        accept="image/*"
        onChange={onImageUpload}
      />
    </label>
    {formState.image && (
      <img
        src={formState.image}
        alt="Preview"
        className={styles.imagePreview}
      />
    )}
    <div className={styles.formActions}>
      <button className={styles.saveButton} onClick={onSave}>Save</button>
      <button className={styles.cancelButton} onClick={onCancel}>Cancel</button>
    </div>
  </div>
);

// Admin page for managing the product catalog at runtime.
//
// Changes are stored in localStorage under "adminInventory" and merged with
// the bundled inventory.json at render time. Admin changes are device-local
// and do not sync across multiple devices.
//
// Note: base64 images stored in localStorage count against the ~5MB limit.
// Avoid uploading very large image files (keep images under 500KB).
//
// Props:
//   items                - merged product catalog (bundled + admin overrides)
//   updateInventoryItem  - (id, fields) => void — update an existing product
//   addInventoryItem     - (item) => void — add a new product
//   removeInventoryItem  - (id) => void — delete a product
//   resetToDefaults      - () => void — clear all admin overrides
const Admin = ({
  items,
  updateInventoryItem,
  addInventoryItem,
  removeInventoryItem,
  resetToDefaults,
}) => {
  // editingId: null = not editing, 'new' = adding, or a product ID string
  const [editingId, setEditingId] = useState(null);
  const [formState, setFormState] = useState({
    name: '', price: '', stock: '', image: '',
  });
  const fileInputRef = useRef(null);

  const openEdit = (item) => {
    setEditingId(item.id);
    setFormState({
      name: item.name,
      price: item.price,
      stock: item.stock !== null && item.stock !== undefined ? item.stock : '',
      image: item.image || '',
    });
  };

  const openAdd = () => {
    setEditingId('new');
    setFormState({name: '', price: '', stock: '', image: ''});
  };

  const cancel = () => {
    setEditingId(null);
    setFormState({name: '', price: '', stock: '', image: ''});
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Convert the selected image file to a base64 data URL.
  // Warns if the file is larger than 500KB to help avoid hitting the
  // ~5MB localStorage limit when multiple images are stored.
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 500 * 1024) {
      // eslint-disable-next-line max-len
      window.alert('Image is larger than 500KB. Large images may fill up local storage quickly. Consider resizing before uploading.');
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setFormState((prev) => ({...prev, image: ev.target.result}));
    };
    reader.readAsDataURL(file);
  };

  const save = () => {
    const {name, price, stock, image} = formState;
    if (!name.trim()) {
      window.alert('Product name is required.');
      return;
    }
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      window.alert('Price must be a positive number.');
      return;
    }
    const parsedStock =
      stock === '' || stock === null ? null : parseInt(stock, 10);
    if (parsedStock !== null && (isNaN(parsedStock) || parsedStock < 0)) {
      window.alert('Stock must be a whole number or blank for unlimited.');
      return;
    }

    const fields = {
      name: name.trim(),
      price: parsedPrice,
      stock: parsedStock,
      ...(image ? {image} : {}),
    };

    if (editingId === 'new') {
      addInventoryItem(fields);
    } else {
      updateInventoryItem(editingId, fields);
    }
    cancel();
  };

  const handleDelete = (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    removeInventoryItem(id);
  };

  const handleReset = () => {
    if (!window.confirm(
        'Reset all products to defaults? This removes all admin edits, ' +
        'added products, and stock counts.',
    )) return;
    resetToDefaults();
  };

  return (
    <div className={styles.admin}>
      <div className={styles.pageHeader}>
        <h2 className={styles.title}>Admin</h2>
        <button className={styles.resetButton} onClick={handleReset}>
          Reset to Defaults
        </button>
      </div>

      <button className={styles.addButton} onClick={openAdd}>
        + Add New Product
      </button>

      {editingId === 'new' && (
        <ProductForm
          formState={formState}
          setFormState={setFormState}
          onSave={save}
          onCancel={cancel}
          onImageUpload={handleImageUpload}
          fileInputRef={fileInputRef}
          title="New Product"
        />
      )}

      <div className={styles.productList}>
        {Object.keys(items).map((key) => {
          const item = items[key];
          const isEditing = editingId === key;
          const imgSrc = item.image ||
            `${process.env.PUBLIC_URL}/images/image${key}.png`;
          const stockLabel = item.stock !== null && item.stock !== undefined ?
            `${item.stock} in stock` : 'Unlimited';

          return (
            <div key={key} className={styles.productEntry}>
              <div className={styles.productRow}>
                <img
                  src={imgSrc}
                  alt={item.name}
                  className={styles.thumbnail}
                />
                <div className={styles.productInfo}>
                  <span className={styles.productName}>{item.name}</span>
                  <span className={styles.productMeta}>
                    ${item.price} &bull; {stockLabel}
                  </span>
                </div>
                <div className={styles.rowActions}>
                  <button
                    className={styles.editButton}
                    onClick={() => isEditing ? cancel() : openEdit(item)}
                  >
                    {isEditing ? 'Close' : 'Edit'}
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(key, item.name)}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {isEditing && (
                <ProductForm
                  formState={formState}
                  setFormState={setFormState}
                  onSave={save}
                  onCancel={cancel}
                  onImageUpload={handleImageUpload}
                  fileInputRef={fileInputRef}
                  title={`Edit: ${item.name}`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Admin;
