const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log('Registering user:', email);

        // Check user exists
        console.log('Checking if user exists...');
        const { data: userExists, error: checkError } = await supabase
            .from('users')
            .select('email')
            .eq('email', email)
            .single();

        if (checkError && checkError.code !== 'PGRST116') {
            console.error('Supabase Check Error:', checkError);
            throw checkError;
        }

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password manually
        console.log('Hashing password...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        console.log('Inserting user into Supabase...');
        const { data: user, error } = await supabase
            .from('users')
            .insert([{ name, email, password: hashedPassword, onboardingStep: 0 }])
            .select()
            .single();

        if (error) {
            console.error('Supabase Insert Error:', error);
            throw error;
        }

        if (user) {
            console.log('User registered successfully:', user.id);
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                onboardingStep: user.onboardingStep,
                token: generateToken(user.id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is not found

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                onboardingStep: user.onboardingStep,
                token: generateToken(user.id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: error.message });
    }
};

const logoutUser = (req, res) => {
    res.status(200).json({ message: 'Logged out successfully' });
};

const getUserProfile = async (req, res) => {
    if (req.user) {
        res.json({
            _id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            onboardingStep: req.user.onboardingStep,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

const updateOnboardingStep = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .update({ onboardingStep: req.body.onboardingStep })
            .eq('id', req.user.id);
        
        if (error) throw error;
        
        res.json({ message: 'Onboarding step updated' });
    } catch (error) {
        console.error('Update Onboarding Step Error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, logoutUser, getUserProfile, updateOnboardingStep };
