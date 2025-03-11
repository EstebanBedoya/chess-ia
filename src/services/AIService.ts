import { Position } from '../pieces/Piece';

export type Difficulty = 'easy' | 'medium' | 'hard';

const difficultyConfigs: Record<Difficulty, { temperature: number; prompt: string }> = {
  easy: {
    temperature: 0.9,
    prompt: `Eres un motor de ajedrez de nivel principiante. 
    IMPORTANTE: Debes elegir un movimiento de la lista proporcionada y responder SOLO con un objeto JSON que contenga row y col.
    Reglas:
    - Elige movimientos simples
    - No analices demasiado
    - Prioriza capturas obvias
    - No uses estrategias complejas`
  },
  medium: {
    temperature: 0.7,
    prompt: `Eres un motor de ajedrez de nivel intermedio.
    IMPORTANTE: Debes elegir un movimiento de la lista proporcionada y responder SOLO con un objeto JSON que contenga row y col.
    Reglas:
    - Analiza las jugadas con moderación
    - Busca tácticas simples
    - Protege tus piezas
    - Controla el centro`
  },
  hard: {
    temperature: 0.5,
    prompt: `Eres un motor de ajedrez de nivel avanzado.
    IMPORTANTE: Debes elegir un movimiento de la lista proporcionada y responder SOLO con un objeto JSON que contenga row y col.
    Reglas:
    - Analiza profundamente cada movimiento
    - Busca las mejores tácticas
    - Planifica estrategias
    - Controla el centro y desarrolla las piezas`
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
    validMoves: Position[]
  ): Promise<Position> {
    const config = difficultyConfigs[difficulty];
    
    const prompt = `${config.prompt}

      Analiza el siguiente tablero y sugiere el mejor movimiento según tu nivel de juego.
      
      Tablero actual (FEN):
      ${boardState}
      
      Movimientos válidos disponibles:
      ${JSON.stringify(validMoves)}
      
      Responde SOLO con el movimiento elegido en formato JSON: {"row": number, "col": number}
    `;

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': window.location.origin,
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
          max_tokens: 500
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

      const moveString = data.choices[0].message.content.trim();
      console.log('Movimiento elegido:', moveString);

      try {
        const move = JSON.parse(moveString) as Position;
        
        // Verificar que el movimiento es válido
        const isValidMove = validMoves.some(
          validMove => validMove.row === move.row && validMove.col === move.col
        );

        if (!isValidMove) {
          throw new Error('Movimiento inválido retornado por la IA');
        }

        return move;
      } catch (parseError) {
        console.error('Error al parsear la respuesta de la IA:', parseError);
        throw new Error('Formato de respuesta inválido');
      }
    } catch (error) {
      console.error('Error al obtener movimiento de la IA:', error);
      // En caso de error, elegir un movimiento aleatorio de los válidos
      return validMoves[Math.floor(Math.random() * validMoves.length)];
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