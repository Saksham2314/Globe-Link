import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Calendar, DollarSign, X, Upload, Play, Loader } from 'lucide-react';
import { getImageUrl } from '../utils/index.js';
import { getApiBaseUrl } from '../utils/api';

export default function EditJourney() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startLocation: '',
    endLocation: '',
    startDate: '',
    endDate: '',
    highlights: [],
    budget: 'moderate',
    transportation: []
  });
  const [existingImages, setExistingImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [transportInput, setTransportInput] = useState('');
  const [highlightInput, setHighlightInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.userType !== 'traveler') {
      navigate('/login');
      return;
    }
    fetchJourney();
  }, [id, navigate]);

  const fetchJourney = async () => {
    try {
      const token = localStorage.getItem('token');
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/journeys/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      const journey = data.journey;
      setFormData({
        title: journey.title || '',
        description: journey.description || '',
        startLocation: journey.startLocation || '',
        endLocation: journey.endLocation || '',
        startDate: journey.startDate?.split('T')[0] || '',
        endDate: journey.endDate?.split('T')[0] || '',
        highlights: journey.highlights || [],
        budget: journey.budget || 'moderate',
        transportation: journey.transportation || []
      });
      setExistingImages(journey.images || []);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e) => {
    const newFiles = Array.from(e.target.files || []);
    addFiles(newFiles);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files || []);
    addFiles(droppedFiles);
  };

  const addFiles = (newFiles) => {
    const filtered = newFiles.filter(file => {
      const size = file.size / (1024 * 1024);
      if (size > 10) {
        setError(`File ${file.name} is too large (max 10MB)`);
        return false;
      }
      return true;
    });

    if (existingImages.length + files.length + filtered.length > 10) {
      setError('Maximum 10 files total');
      return;
    }

    setFiles(prev => [...prev, ...filtered]);

    filtered.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreviews(prev => [...prev, {
          preview: reader.result,
          name: file.name,
          type: file.type,
          isNew: true
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setFilePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const addHighlight = () => {
    if (highlightInput.trim()) {
      setFormData(prev => ({
        ...prev,
        highlights: [...prev.highlights, highlightInput]
      }));
      setHighlightInput('');
    }
  };

  const removeHighlight = (index) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  const addTransportation = () => {
    if (transportInput.trim()) {
      setFormData(prev => ({
        ...prev,
        transportation: [...prev.transportation, transportInput]
      }));
      setTransportInput('');
    }
  };

  const removeTransportation = (index) => {
    setFormData(prev => ({
      ...prev,
      transportation: prev.transportation.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const formDataObj = new FormData();

      formDataObj.append('title', formData.title);
      formDataObj.append('description', formData.description);
      formDataObj.append('startLocation', formData.startLocation);
      formDataObj.append('endLocation', formData.endLocation);
      formDataObj.append('startDate', formData.startDate);
      formDataObj.append('endDate', formData.endDate);
      formDataObj.append('budget', formData.budget);
      formDataObj.append('highlights', JSON.stringify(formData.highlights));
      formDataObj.append('transportation', JSON.stringify(formData.transportation));
      formDataObj.append('existingImages', JSON.stringify(existingImages));

      files.forEach(file => {
        formDataObj.append('files', file);
      });

      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/journeys/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataObj
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update journey');
      }

      navigate('/dashboard/traveler');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Loader className="w-12 h-12 text-purple-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Edit Your Journey</h1>
          <p className="text-purple-200">Update your travel experience details</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-6 py-4 rounded-xl mb-6 backdrop-blur-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title & Description */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="mb-6">
              <label className="flex text-sm font-medium text-purple-200 mb-3">Journey Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Epic Road Trip Across Europe"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 transition-all"
                required
              />
            </div>

            <div>
              <label className="flex text-sm font-medium text-purple-200 mb-3">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell us about your journey, what made it special, tips and recommendations..."
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 transition-all resize-none h-32"
                required
              />
            </div>
          </div>

          {/* Locations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <label className="flex items-center gap-2 text-sm font-medium text-purple-200 mb-3">
                <MapPin size={16} /> From *
              </label>
              <input
                type="text"
                name="startLocation"
                value={formData.startLocation}
                onChange={handleChange}
                placeholder="Starting location"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 transition-all"
                required
              />
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <label className="flex items-center gap-2 text-sm font-medium text-purple-200 mb-3">
                <MapPin size={16} /> To *
              </label>
              <input
                type="text"
                name="endLocation"
                value={formData.endLocation}
                onChange={handleChange}
                placeholder="Destination"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 transition-all"
                required
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <label className="flex items-center gap-2 text-sm font-medium text-purple-200 mb-3">
                <Calendar size={16} /> Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 transition-all"
                required
              />
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <label className="flex items-center gap-2 text-sm font-medium text-purple-200 mb-3">
                <Calendar size={16} /> End Date *
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 transition-all"
                required
              />
            </div>
          </div>

          {/* Budget */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <label className="flex items-center gap-2 text-sm font-medium text-purple-200 mb-3">
              <DollarSign size={16} /> Budget Level
            </label>
            <select
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 transition-all"
            >
              <option value="budget" className="bg-slate-900">Budget-friendly</option>
              <option value="moderate" className="bg-slate-900">Moderate</option>
              <option value="luxury" className="bg-slate-900">Luxury</option>
            </select>
          </div>

          {/* Highlights */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <label className="text-sm font-medium text-purple-200 mb-3 block">Journey Highlights</label>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={highlightInput}
                onChange={(e) => setHighlightInput(e.target.value)}
                placeholder="e.g., Eiffel Tower, Swiss Alps..."
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 transition-all"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
              />
              <button
                type="button"
                onClick={addHighlight}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.highlights.map((highlight, idx) => (
                <span key={idx} className="bg-purple-500/30 text-purple-200 px-4 py-2 rounded-full text-sm flex items-center gap-2 border border-purple-400/30">
                  {highlight}
                  <button
                    type="button"
                    onClick={() => removeHighlight(idx)}
                    className="text-purple-300 hover:text-purple-100 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Transportation */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <label className="text-sm font-medium text-purple-200 mb-3 block">Transportation Methods</label>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={transportInput}
                onChange={(e) => setTransportInput(e.target.value)}
                placeholder="e.g., Car, Bus, Train, Flight..."
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 transition-all"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTransportation())}
              />
              <button
                type="button"
                onClick={addTransportation}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.transportation.map((transport, idx) => (
                <span key={idx} className="bg-blue-500/30 text-blue-200 px-4 py-2 rounded-full text-sm flex items-center gap-2 border border-blue-400/30">
                  {transport}
                  <button
                    type="button"
                    onClick={() => removeTransportation(idx)}
                    className="text-blue-300 hover:text-blue-100 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Existing Media */}
          {existingImages.length > 0 && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-purple-200 font-medium mb-4">Current Media</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {existingImages.map((img, idx) => (
                  <div key={idx} className="relative group rounded-lg overflow-hidden border border-white/20">
                    <img src={getImageUrl(img)} alt="Journey" className="w-full h-24 object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(idx)}
                      className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* File Upload */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <label className="text-sm font-medium text-purple-200 mb-4 block">Add More Media (Images & Videos)</label>

            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                dragActive
                  ? 'border-purple-400 bg-purple-500/20'
                  : 'border-purple-400/50 bg-white/5'
              }`}
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-purple-300" />
              <p className="text-white font-medium mb-2">Drag and drop files here</p>
              <p className="text-purple-200/70 text-sm mb-4">or</p>
              <label className="inline-block">
                <input
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  accept="image/*,video/*"
                />
                <span className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium cursor-pointer inline-block">
                  Browse Files
                </span>
              </label>
              <p className="text-purple-200/50 text-xs mt-4">Max 10 files total, 10MB each</p>
              <p className="text-purple-200/50 text-xs">{existingImages.length + files.length}/10 files</p>
            </div>

            {filePreviews.length > 0 && (
              <div className="mt-6">
                <h3 className="text-purple-200 font-medium mb-4">New Files ({filePreviews.length})</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filePreviews.map((file, idx) => (
                    <div key={idx} className="relative group rounded-lg overflow-hidden border border-white/20">
                      {file.type.startsWith('image/') ? (
                        <img src={file.preview} alt={file.name} className="w-full h-24 object-cover" />
                      ) : (
                        <div className="w-full h-24 bg-black/40 flex items-center justify-center">
                          <Play className="w-8 h-8 text-purple-300" />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                      <p className="text-xs text-purple-200/70 p-2 truncate">{file.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold text-lg rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-purple-300 border-t-white rounded-full animate-spin"></div>
                Saving Changes...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
