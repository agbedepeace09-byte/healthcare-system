const express = require("express");
const router = express.Router();
const prisma = require("../prismaClient");

// GET: Full patient medical history (Vitals, Notes, Labs, Prescriptions)
router.get("/history/:patientId", async (req, res) => {
  try {
    const patientId = parseInt(req.params.patientId);

    const history = await prisma.visit.findMany({
      where: { patientId, status: "DISCHARGED" },
      include: {
        vitals: true,
        notes: true,
        labRequests: true,
        prescriptions: true,
        doctor: { select: { firstName: true, lastName: true } },
      },
      orderBy: { checkInTime: "desc" },
    });

    res.status(200).json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch medical history." });
  }
});

// POST: Save clinical notes for a visit
router.post("/:visitId/notes", async (req, res) => {
  try {
    const visitId = parseInt(req.params.visitId);
    const { patientId, doctorId, symptoms, diagnosis } = req.body;

    const note = await prisma.clinicalNote.create({
      data: { visitId, patientId, doctorId, symptoms, diagnosis },
    });

    res.status(201).json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save clinical note." });
  }
});

// POST: Trigger deterministic NER pipeline for Clinical Notes
router.post("/:noteId/extract-entities", async (req, res) => {
  try {
    const noteId = parseInt(req.params.noteId);

    const note = await prisma.clinicalNote.findUnique({
      where: { id: noteId },
    });
    if (!note) return res.status(404).json({ error: "Note not found." });

    // This acts as the bridge to your Python/spaCy pipeline.
    // You would use axios/fetch here to send `note.symptoms` to your rule-based NER service.

    /* const pythonNERResponse = await axios.post('http://your-python-service/extract', { text: note.symptoms });
    const extractedDataString = JSON.stringify(pythonNERResponse.data);
    */

    // Simulating the save operation after receiving the deterministic entities
    const updatedNote = await prisma.clinicalNote.update({
      where: { id: noteId },
      data: { aiSummary: "Extracted Entities: [Fever, 3 Days, Paracetamol]" }, // Replace with actual response
    });

    res.status(200).json(updatedNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Entity extraction pipeline failed." });
  }
});

module.exports = router;
