'use client';
import { useEffect, useState, useCallback } from 'react';
import { api, adminApi, getUploadUrl } from '@/utils/api';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/utils/cropImage';

export default function AdminOwner() {
  const [owner, setOwner] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Cropping State
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  useEffect(() => {
    api.getOwner().then((data) => {
      setOwner(data);
      setName(data.name);
      setDescription(data.description);
    }).catch(console.error);
  }, []);

  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageDataUrl = URL.createObjectURL(file);
      setImageSrc(imageDataUrl);
      setShowCropper(true);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropSave = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      // Convert Blob to File for compatibility with uploadFile
      const file = new File([croppedImage], 'owner-photo.jpg', { type: 'image/jpeg' });
      setPhotoFile(file);
      setShowCropper(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { name, description };
      if (photoFile) {
        const upload = await adminApi.uploadFile(photoFile);
        data.photo_url = upload.url;
      }
      const updated = await adminApi.updateOwner(data);
      setOwner(updated);
      setPhotoFile(null); // Clear pending upload
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
        Edit the &quot;Meet the Founder&quot; section on the homepage.
      </p>

      {owner && (
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '32px', alignItems: 'start' }}>
          {/* Photo Preview */}
          <div>
            {photoFile ? (
              <div style={{ position: 'relative' }}>
                <img src={URL.createObjectURL(photoFile)} alt="Preview" style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', border: '2px solid var(--color-primary)', boxShadow: 'var(--glow-yellow)' }} />
                <span style={{ position: 'absolute', top: '-10px', right: '-10px', background: 'var(--color-primary)', color: '#000', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>CROPPED</span>
              </div>
            ) : owner.photo_url ? (
              <img src={getUploadUrl(owner.photo_url)} alt={owner.name} style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', border: '2px solid var(--color-border)' }} />
            ) : (
              <div style={{ width: '200px', height: '200px', borderRadius: 'var(--radius-lg)', background: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', color: 'var(--color-primary)', opacity: 0.3, border: '2px solid var(--color-border)' }}>
                {name.charAt(0)}
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label>Name</label>
              <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Photo</label>
              <input type="file" accept="image/*" onChange={onFileChange} className="form-input" />
              <small style={{ color: 'var(--color-text-muted)', marginTop: '4px', display: 'block' }}>You will be prompted to crop the image after selection.</small>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea className="form-input" value={description} onChange={(e) => setDescription(e.target.value)} rows={5} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ alignSelf: 'start' }}>
              {loading ? 'Saving...' : saved ? '✓ Saved!' : 'Update Owner'}
            </button>
          </form>
        </div>
      )}

      {/* Cropper Modal Overlay */}
      {showCropper && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 10000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '500px', height: '500px', background: '#111', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1 / 1}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div style={{ marginTop: '20px', display: 'flex', gap: '16px' }}>
            <button className="btn btn-outline" onClick={() => setShowCropper(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleCropSave}>Crop & Save</button>
          </div>
        </div>
      )}
    </div>
  );
}
