// Importazione delle entità e dei DAO
import { Utente } from "../entity/gestione_autenticazione/Utente";
import { UtenteDao } from "../dao/UtenteDao";

export class AutenticazioneService {
  private utenteDao: UtenteDao;

  constructor() {
    this.utenteDao = new UtenteDao();
  }

  /**
   * Metodo per gestire il login dell'utente.
   * @param email - Email utente inserito.
   * @param password - Password inserita.
   * @returns Una promessa che risolve un oggetto con informazioni sull'utente o un messaggio di errore.
   */
  async login(
    email: string,
    password: string,
  ): Promise<{ success: boolean; user?: Utente; message?: string }> {
    try {
      // Validazione input
      if (!email || !password) {
        return {
          success: false,
          message: "Email e password sono obbligatori.",
        };
      }

      if (email.length > 30 || email.length < 6) {
        return {
          success: false,
          message: "Lunghezza email non valida.",
        };
      }

      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        return {
          success: false,
          message: "Formato email non valido.",
        };
      }

      const passwordRegex = /^(?=.*[!@#$%^&*])(?=.*\d)(?=.*[A-Z]).{8,14}$/;
      if (!passwordRegex.test(password)) {
        return {
          success: false,
          message: "Formato password non valido.",
        };
      }

      // Recupera l'utente dal database tramite il DAO
      const user: Utente | null = await this.utenteDao.getUtenteByEmail(email);

      // Controllo dell'esistenza dell'utente
      if (!user) {
        return {
          success: false,
          message: "Utente non trovato.",
        };
      }

      // Verifica della password
      if (user.getPassword() != password) {
        return {
          success: false,
          message: "Password errata.",
        };
      }

      // Login riuscito
      return {
        success: true,
        user: user,
      };
    } catch (error) {
      console.error("Errore durante il login:", error);
      return {
        success: false,
        message: "Errore interno del server. Riprova più tardi.",
      };
    }
  }

  /**
   * Metodo per gestire il logout dell'utente.
   * @param userId - ID dell'utente che sta effettuando il logout.
   * @returns Una promessa che risolve un oggetto con il risultato dell'operazione.
   */
  async logout(userId: string): Promise<{ success: boolean; message: string }> {
    try {
      // Validazione dell'input
      if (!userId) {
        return {
          success: false,
          message: "ID utente obbligatorio per effettuare il logout.",
        };
      }

      // Qui puoi implementare logica specifica per il tuo sistema, ad esempio:
      // - Invalidare token JWT salvati nel database
      // - Aggiornare uno stato dell'utente nel database
      // - Semplicemente registrare l'evento di logout

      console.log(`Logout effettuato per l'utente con ID: ${userId}`);

      // Logout riuscito
      return {
        success: true,
        message: "Logout effettuato con successo.",
      };
    } catch (error) {
      console.error("Errore durante il logout:", error);
      return {
        success: false,
        message: "Errore interno del server. Riprova più tardi.",
      };
    }
  }

  /**
   * Metodo per registrare un nuovo utente.
   * @param email - Email dell'utente.
   * @param password - Password dell'utente.
   * @param nome - Nome dell'utente.
   * @param cognome - Cognome dell'utente.
   * @returns Una promessa che risolve un oggetto con il risultato dell'operazione.
   */
  async registraUtente(
    email: string,
    password: string,
    nome: string,
    cognome: string,
  ): Promise<{ success: boolean; message: string; user?: Utente }> {
    try {
      if (!email || !password || !nome || !cognome) {
        return {
          success: false,
          message: "Tutti i campi sono obbligatori.",
        };
      }

      //lunghezza nome compresa tra 1 e 20 caratteri
      if (nome.length < 2 || nome.length > 20) {
        return {
          success: false,
          message: "Il nome fornito non è valido.",
        };
      }

      //lunghezza cognome compresa tra 1 e 20 caratteri
      if (cognome.length < 2 || cognome.length > 20) {
        return {
          success: false,
          message: "Il cognome fornito non è valido.",
        };
      }

      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        return {
          success: false,
          message: "Formato email non valido.",
        };
      }

      const passwordRegex = /^(?=.*[!@#$%^&*])(?=.*\d)(?=.*[A-Z]).{8,14}$/;
      if (!passwordRegex.test(password)) {
        return {
          success: false,
          message:
            "La password deve contenere almeno 8 caratteri, una lettera maiuscola, un numero e un carattere speciale.",
        };
      }

      const utenteEsistente = await this.utenteDao.getUtenteByEmail(email);
      if (utenteEsistente) {
        return {
          success: false,
          message: "Email già in uso.",
        };
      }

      const ruolo = false; // Predefinito come booleano per "utente"

      const nuovoUtente = new Utente(
        undefined,
        email,
        password,
        nome,
        cognome,
        ruolo,
        0,
      );

      await this.utenteDao.createUtente(nuovoUtente);

      return {
        success: true,
        message: "Registrazione completata con successo.",
      };
    } catch (error) {
      console.error("Errore durante la registrazione:", error);
      return {
        success: false,
        message: "Errore interno del server. Riprova più tardi.",
      };
    }
  }
  // Metodo per controllare se un'email esiste nel database
  async checkEmailExists(email: string): Promise<boolean> {
    try {
      const user = await this.utenteDao.getUtenteByEmail(email);
      return !!user;
    } catch (error) {
      console.error("Errore durante il controllo dell'email:", error);
      return false;
    }
  }
}
