import express from "express";
import { FeedbackService } from "@/services/FeedbackService";

const router = express.Router();

//creazione Feedback

router.post("/creaFeedback", async (req, res) => {
  const { valutazione, commento, utenteId, tutorialId } = req.body;
  try {
    const feedbackService = new FeedbackService();
    const feedback = await feedbackService.creaFeedback(
      valutazione,
      commento,
      utenteId,
      tutorialId,
    );
    res.status(201).json({ message: "Feedback creato con successo", feedback });
  } catch (error) {
    res.status(500).json({ message: "Errore del server", error });
  }
});

//Eliminazione Feedback
router.post("/eliminaFeedback", async (req, res) => {
  const { feedback } = req.body;
  try {
    const feedbackService = new FeedbackService();
    const result = await feedbackService.EliminaFeedback(feedback);
    //si è supposto il passaggio dell'oggetto feedback

    if (result.success) {
      res.status(200).json({ message: result.message });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    console.error("Errore durante l'eliminazione del feedback:", error);
    res.status(500).json({ message: "Errore del server", error });
  }
});

//visualizzazione feedback per tutorial

router.get("/visualizzaFeedback/:tutorialId", async (req, res) => {
  const { tutorialId } = req.params;
  try {
    const feedbackService = new FeedbackService();
    const feedback = await feedbackService.VisualizzaFeedbackTutorial(
      parseInt(tutorialId),
    );
    res.status(200).json(feedback);
  } catch (error) {
    console.error("Errore durante la visualizzazione del feedback:", error);
    res.status(500).json({ message: "Errore del server", error });
  }
});

//visualizzazione feedback per utente

router.get("/visualizzaFeedbackUtente/:utenteId", async (req, res) => {
  const { utenteId } = req.params;
  try {
    const feedbackService = new FeedbackService();
    const feedback = await feedbackService.VisualizzaFeedbackUtente(
      parseInt(utenteId),
    );
    res.status(200).json(feedback);
  } catch (error) {
    console.error("Errore durante la visualizzazione del feedback:", error);
    res.status(500).json({ message: "Errore del server", error });
  }
});

//modifica feedback

router.get("/modificaFeedback/:feedbackId", async (req, res) => {
  const { feedback } = req.body;
  try {
    const feedbackService = new FeedbackService();
    const result = await feedbackService.AggiornaFeedback(
      feedback.getTutorialId(),
      feedback.getUtenteId(),
      feedback.getValutazione(),
      feedback.getCommento(),
    );
    res.status(200).json(result);
  } catch (error) {
    console.error("Errore durante la modifica del feedback:", error);
    res.status(500).json({ message: "Errore del server", error });
  }
});
