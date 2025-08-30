import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from 'react-spinners'; // Import the loading spinner

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // State to manage loading
    const [phoneError, setPhoneError] = useState(''); // State for phone validation error
    const navigate = useNavigate();

    // console.log('Toast object:', toast);
    // console.log('Toast POSITION:', toast.POSITION);

    // Regex for validating Nigerian phone number (+234 followed by 10 digits)
    const phoneRegex = /^(?:\+234|0)(\d{10})$/;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === 'phone') {
            // Reset phone error as the user is typing
            setPhoneError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true); // Set loading to true when form is submitted

        // Validate phone number behind the scenes before form submission
        let phone = formData.phone.trim();

        // If the number starts with +234, replace it with 0
        if (phone.startsWith('+234')) {
            phone = '0' + phone.slice(4);
        }

        // Check if phone number is valid (either starting with 0 and 11 digits or +234 and 14 digits)
        if (!phoneRegex.test(phone)) {
            setPhoneError('Please enter a valid Nigerian phone number.');
            setIsLoading(false); // Reset loading state if phone number is invalid
            return; // Prevent form submission if phone number is invalid
        }

        // Update the form data with the corrected phone number
        formData.phone = phone;

        try {
            // Send the registration data to the server
            await API.post('/register', formData);
            // Show success toast
            toast.success('Registration successful! Please log in.', {
                // position: toast.POSITION.TOP_CENTER,
                position: 'top-center',
            });
            navigate('/login');
        } catch (err) {
            // Show error toast
            setError(err.response?.data?.message || 'Registration failed.');
            toast.error(err.response?.data?.message || 'Registration failed.', {
                // position: toast.POSITION.TOP_CENTER,
                position: 'top-center',
            });
        } finally {
            setIsLoading(false); // Reset loading state when the request is finished
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

                {error && (
                    <p className="mb-4 p-4 text-sm text-white bg-red-500 rounded-md shadow-md">
                        {error}
                    </p>
                )}

                {!error && !isLoading && (
                    <p className="mb-4 p-4 text-sm text-white bg-green-500 rounded-md shadow-md">
                        Registration successful! Please log in.
                    </p>
                )}

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        required
                    />
                    {phoneError && <p className="text-red-600 text-sm">{phoneError}</p>} {/* Show phone error */}
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    disabled={isLoading} // Disable the button when loading
                >
                    {isLoading ? (
                        <div className="flex justify-center">
                            <ClipLoader size={20} color="#fff" /> {/* Show loading spinner */}
                        </div>
                    ) : (
                        'Sign Up'
                    )}
                </button>

                <p className="mt-4 text-sm text-center text-gray-600">
                    Already have an account? <a href="/login" className="text-blue-500 hover:underline">Login</a>
                </p>
            </form>

            {/* Toast Container to display notifications */}
            <ToastContainer />
        </div>
    );
}

export default Register;