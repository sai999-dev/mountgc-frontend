import { useState, useEffect, useRef } from 'react';
import { X, FileText, CheckCircle, RefreshCw } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const TermsModal = ({ isOpen, onClose, onAccept, serviceType, counsellingServiceTypeId }) => {
  const [terms, setTerms] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accepted, setAccepted] = useState(false);
  const [signedName, setSignedName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Signature canvas state
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  // Already signed state - show signed agreement instead of form
  const [alreadySigned, setAlreadySigned] = useState(false);
  const [existingAgreement, setExistingAgreement] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setTerms(null);
      setAccepted(false);
      setSignedName('');
      setHasSignature(false);
      setAlreadySigned(false);
      setExistingAgreement(null);
      fetchTerms();
      checkExistingAgreement();
    }
  }, [isOpen, serviceType, counsellingServiceTypeId]);

  // Initialize canvas when terms are loaded
  useEffect(() => {
    if (terms && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  }, [terms]);

  const fetchTerms = async () => {
    try {
      let url = `https://mountgc-backend.onrender.com/api/student/terms/${serviceType}`;
      if (serviceType === 'counselling_session' && counsellingServiceTypeId) {
        url += `?counselling_service_type_id=${counsellingServiceTypeId}`;
      }

      const response = await axios.get(url);

      if (response.data.success) {
        setTerms(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching terms:', error);
      if (error.response?.status === 404) {
        toast.error('No terms found for this service. Please contact support.');
      } else {
        toast.error('Failed to load terms and conditions');
      }
    } finally {
      setLoading(false);
    }
  };

  const checkExistingAgreement = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      let url = `https://mountgc-backend.onrender.com/api/student/agreement/${serviceType}/check`;
      if (serviceType === 'counselling_session' && counsellingServiceTypeId) {
        url += `?counselling_service_type_id=${counsellingServiceTypeId}`;
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success && response.data.data.has_agreed) {
        // User has already signed - show their signed agreement
        setAlreadySigned(true);
        setExistingAgreement(response.data.data.agreement);
      }
    } catch (error) {
      console.error('Error checking agreement:', error);
    }
  };

  // Canvas drawing functions
  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if (e.touches) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const getSignatureImage = () => {
    const canvas = canvasRef.current;
    return canvas.toDataURL('image/png');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!accepted) {
      toast.error('Please accept the terms and conditions');
      return;
    }

    if (!signedName.trim()) {
      toast.error('Please enter your full name');
      return;
    }

    if (!hasSignature) {
      toast.error('Please draw your signature');
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem('accessToken');
      const signatureImage = getSignatureImage();

      const payload = {
        service_type: serviceType,
        signed_name: signedName,
        signature_image: signatureImage,
        terms_id: terms.terms_id
      };

      if (serviceType === 'counselling_session' && counsellingServiceTypeId) {
        payload.counselling_service_type_id = counsellingServiceTypeId;
      }

      const response = await axios.post(
        'https://mountgc-backend.onrender.com/api/student/agreement/sign',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('Terms accepted successfully!');
        onAccept();
        onClose();
      }
    } catch (error) {
      console.error('Error signing agreement:', error);
      toast.error(error.response?.data?.message || 'Failed to sign agreement');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full p-6 my-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FileText className="text-green-600" size={28} />
            <h2 className="text-2xl font-bold text-gray-800">Terms & Conditions</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
            disabled={submitting}
          >
            <X size={24} />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : alreadySigned && existingAgreement ? (
          /* Show already signed agreement */
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="text-green-600" size={24} />
                <h3 className="text-lg font-bold text-green-800">Agreement Already Signed</h3>
              </div>
              <p className="text-sm text-green-700">
                You have already signed the Terms & Conditions for this service. You can proceed to payment.
              </p>
            </div>

            {/* Show signed agreement details */}
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <h4 className="font-semibold text-gray-800 mb-3">Your Signed Agreement</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Signed Name:</p>
                  <p className="font-semibold text-gray-800">{existingAgreement.signed_name}</p>
                </div>
                <div>
                  <p className="text-gray-500">Signed On:</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(existingAgreement.agreed_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Terms Version:</p>
                  <p className="font-semibold text-gray-800">{existingAgreement.terms_version || existingAgreement.terms?.version}</p>
                </div>
                <div>
                  <p className="text-gray-500">Agreement ID:</p>
                  <p className="font-semibold text-gray-800">#{existingAgreement.agreement_id}</p>
                </div>
              </div>

              {/* Show signature image if available */}
              {existingAgreement.signature_image && (
                <div className="mt-4">
                  <p className="text-gray-500 text-sm mb-2">Your Signature:</p>
                  <div className="border border-gray-300 rounded bg-white p-2 inline-block">
                    <img
                      src={existingAgreement.signature_image}
                      alt="Your signature"
                      className="max-h-20"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  onAccept();
                  onClose();
                }}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center space-x-2"
              >
                <CheckCircle size={20} />
                <span>Continue to Payment</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : terms ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Terms Title */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-lg font-bold text-green-800">{terms.title}</h3>
              <p className="text-sm text-green-600 mt-1">Version {terms.version}</p>
            </div>

            {/* Terms Content */}
            <div className="border border-gray-300 rounded-lg p-6 max-h-64 overflow-y-auto bg-gray-50">
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed">
                  {terms.content}
                </pre>
              </div>
            </div>

            {/* Acceptance Checkbox */}
            <div className="flex items-start space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <input
                type="checkbox"
                id="accept-terms"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="mt-1 w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                required
              />
              <label htmlFor="accept-terms" className="text-sm text-gray-700 cursor-pointer">
                <span className="font-semibold">I have read and agree to the terms and conditions above.</span>
                <p className="text-xs text-gray-600 mt-1">
                  By checking this box, you acknowledge that you understand and accept all the terms outlined in this agreement.
                </p>
              </label>
            </div>

            {/* Signature Section */}
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Draw Your Signature <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={clearSignature}
                  className="text-sm text-gray-600 hover:text-gray-800 flex items-center space-x-1"
                >
                  <RefreshCw size={14} />
                  <span>Clear</span>
                </button>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg bg-white overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={500}
                  height={150}
                  className="w-full cursor-crosshair touch-none"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Use your mouse or finger to draw your signature above
              </p>
            </div>

            {/* Typed Name Field */}
            <div>
              <label htmlFor="signed-name" className="block text-sm font-semibold text-gray-700 mb-2">
                Type Your Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="signed-name"
                value={signedName}
                onChange={(e) => setSignedName(e.target.value)}
                placeholder="Enter your full legal name"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 font-serif text-lg"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                This confirms your identity and serves as your digital signature
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={!accepted || !signedName.trim() || !hasSignature || submitting}
                className={`flex-1 font-semibold py-3 rounded-lg transition flex items-center justify-center space-x-2 ${
                  !accepted || !signedName.trim() || !hasSignature || submitting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                <CheckCircle size={20} />
                <span>{submitting ? 'Processing...' : 'Sign & Continue to Payment'}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-6 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 rounded-lg transition"
              >
                Cancel
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-2">
              Your signed agreement will be securely stored as a PDF document and can be downloaded by administrators.
            </p>
          </form>
        ) : (
          <div className="text-center py-8">
            <p className="text-red-600">Failed to load terms and conditions. Please try again.</p>
            <button
              onClick={onClose}
              className="mt-4 bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TermsModal;
