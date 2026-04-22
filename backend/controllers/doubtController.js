const supabase = require('../config/supabase');

const saveDoubt = async (req, res) => {
    try {
        const { userId, question, answer, subject, topic } = req.body;

        if (!userId || !question || !answer) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const { data: savedDoubt, error } = await supabase
            .from('doubts')
            .insert([{
                userId,
                question,
                answer,
                subject,
                topic,
                status: 'resolved'
            }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(savedDoubt);
    } catch (error) {
        console.error("Save Doubt Error:", error.message);
        res.status(500).json({ error: "Failed to save doubt" });
    }
};

const getDoubts = async (req, res) => {
    try {
        const { userId } = req.params;
        const { data: doubts, error } = await supabase
            .from('doubts')
            .select('*')
            .eq('userId', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(doubts);
    } catch (error) {
        console.error("Get Doubts Error:", error.message);
        res.status(500).json({ error: "Failed to fetch doubts" });
    }
};

const deleteDoubt = async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase
            .from('doubts')
            .delete()
            .eq('id', id);

        if (error) throw error;
        res.json({ message: "Doubt deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete doubt" });
    }
};

module.exports = { saveDoubt, getDoubts, deleteDoubt };
