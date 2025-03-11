import { Piece, Position } from '../pieces/Piece';
import { moveToAlgebraic, algebraicToMove } from '../utils/algebraicNotation';

export type Difficulty = 'easy' | 'medium' | 'hard';

const difficultyConfigs: Record<Difficulty, { temperature: number; prompt: string }> = {
  easy: {
    temperature: 0.9,
    prompt: `Eres un motor de ajedrez de nivel principiante. 
    IMPORTANTE: Debes elegir un movimiento de la lista proporcionada y responder SOLO con la notación algebraica del movimiento.
    Ejemplos de respuestas válidas: "e4", "Nf3", "Bxe5", "O-O", "O-O-O"
    NO agregues ningún texto adicional ni explicaciones.
    
    Reglas:
    - Elige movimientos simples
    - No analices demasiado
    - Prioriza capturas obvias
    - No uses estrategias complejas`
  },
  medium: {
    temperature: 0.7,
    prompt: `Eres un motor de ajedrez de nivel intermedio.
    IMPORTANTE: Debes elegir un movimiento de la lista proporcionada y responder SOLO con la notación algebraica del movimiento.
    Ejemplos de respuestas válidas: "e4", "Nf3", "Bxe5", "O-O", "O-O-O"
    NO agregues ningún texto adicional ni explicaciones.
    
    Reglas:
    - Analiza las jugadas con moderación
    - Busca tácticas simples
    - Protege tus piezas
    - Controla el centro`
  },
  hard: {
    temperature: 0.5,
    prompt: `Eres un motor de ajedrez experto con un nivel de juego equivalente a un Gran Maestro (Elo 2700+). 
    Analizas cada posición utilizando principios estratégicos y tácticos avanzados. Debes calcular múltiples jugadas con profundidad y evaluar factores posicionales, materiales y dinámicos.
    
    Objetivos:
    - Juega de manera óptima en cualquier posición.
    - Calcula y evalúa posiciones considerando ataque, defensa y juego posicional.
    - Proporciona la mejor jugada disponible en cada turno.
    
    NO agregues ningún texto adicional ni explicaciones y responder SOLO con la notación algebraica del movimiento.`
  }
};

export class AIService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getNextMove(
    boardState: string,
    difficulty: Difficulty,
    validMoves: { from: Position; to: Position }[],
    board: (Piece | null)[][]
  ): Promise<{ from: Position; to: Position }> {
    const config = difficultyConfigs[difficulty];
    
    // Convertir los movimientos válidos a notación algebraica
    const validMovesAlgebraic = validMoves.map(move => 
      moveToAlgebraic(move.from, move.to, board)
    );

    const prompt = `${config.prompt}

      Posición actual del tablero (FEN):
      ${boardState}

      Movimientos válidos disponibles (DEBES elegir uno de estos):
      ${JSON.stringify(validMovesAlgebraic)}

      IMPORTANTE: Responde SOLO con la notación algebraica del movimiento elegido.
      NO agregues explicaciones ni texto adicional.
    `;

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'openchat/openchat-7b:free',
          messages: [
            {
              role: 'system',
              content: config.prompt
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: config.temperature,
          max_tokens: 150,
          response_format: { type: "text" }
        })
      });

      if (!response.ok) {
        throw new Error(`Error en la API: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Respuesta de la IA:', data);

      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Respuesta inválida de la IA');
      }

      const moveAlgebraic = data.choices[0].message.content.trim();
      console.log('Movimiento elegido:', moveAlgebraic);

      // Verificar que el movimiento está en la lista de movimientos válidos
      if (!validMovesAlgebraic.includes(moveAlgebraic)) {
        throw new Error('Movimiento inválido retornado por la IA');
      }

      // Convertir la notación algebraica a posiciones
      const move = algebraicToMove(moveAlgebraic, board);
      if (!move) {
        throw new Error('No se pudo convertir el movimiento algebraico a posiciones');
      }

      return move;
    } catch (error) {
      console.error('Error al obtener movimiento de la IA:', error);
      // En caso de error, elegir un movimiento aleatorio de los válidos
      const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
      return randomMove;
    }
  }

  // Convierte el estado del tablero a notación FEN
  static boardToFEN(board: (string | null)[][]): string {
    let fen = '';
    for (let row = 0; row < 8; row++) {
      let emptyCount = 0;
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece === null) {
          emptyCount++;
        } else {
          if (emptyCount > 0) {
            fen += emptyCount;
            emptyCount = 0;
          }
          fen += piece;
        }
      }
      if (emptyCount > 0) {
        fen += emptyCount;
      }
      if (row < 7) fen += '/';
    }
    return fen;
  }
} 