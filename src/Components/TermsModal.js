import { useState, useEffect } from 'react';
import { X, FileText, CheckCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const TermsModal = ({ isOpen, onClose, onAccept, serviceType, counsellingServiceTypeId }) => {
  const [terms, setTerms] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accepted, setAccepted] = useState(false);
  const [signedName, setSignedName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setTerms(null);
      setAccepted(false);
      setSignedName('');
      fetchTerms();
      checkExistingAgreement();
    }
  }, [isOpen, serviceType, counsellingServiceTypeId]);

  const fetchTerms = async () => {
    try {
      // Build URL with query params for counselling sessions
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

      // Build URL with query params for counselling sessions
      let url = `https://mountgc-backend.onrender.com/api/student/agreement/${serviceType}/check`;
      if (serviceType === 'counselling_session' && counsellingServiceTypeId) {
        url += `?counselling_service_type_id=${counsellingServiceTypeId}`;
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success && response.data.data.has_agreed) {
        // User already agreed, skip modal
        onAccept();
        onClose();
      }
    } catch (error) {
      console.error('Error checking agreement:', error);
    }
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

    setSubmitting(true);

    try {
      const token = localStorage.getItem('accessToken');

      const payload = {
        service_type: serviceType,
        signed_name: signedName,
        terms_id: terms.terms_id
      };

      // Include counselling_service_type_id for counselling sessions
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
        onAccept(); // Proceed with payment
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
        ) : terms ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Terms Title */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-lg font-bold text-green-800">{terms.title}</h3>
              <p className="text-sm text-green-600 mt-1">Version {terms.version}</p>
            </div>

            {/* Terms Content */}
            <div className="border border-gray-300 rounded-lg p-6 max-h-96 overflow-y-auto bg-gray-50">
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

            {/* Signature Field */}
            <div>
              <label htmlFor="signed-name" className="block text-sm font-semibold text-gray-700 mb-2">
                Type Your Full Name (Digital Signature) <span className="text-red-500">*</span>
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
                This will serve as your legal digital signature
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={!accepted || !signedName.trim() || submitting}
                className={`flex-1 font-semibold py-3 rounded-lg transition flex items-center justify-center space-x-2 ${
                  !accepted || !signedName.trim() || submitting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                <CheckCircle size={20} />
                <span>{submitting ? 'Processing...' : 'Accept & Continue to Payment'}</span>
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
              Your agreement will be securely stored and can be accessed by administrators for record-keeping purposes.
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
