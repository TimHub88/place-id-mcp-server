const { placesController } = require('../controllers');

// Mode JSON-RPC pour Smithery
const isStdioMode = process.argv.includes('--stdio');

// Fonction utilitaire pour logger sans perturber le mode stdio
const safeLog = (message, data) => {
  if (!isStdioMode) {
    if (data) {
      console.log(message, data);
    } else {
      console.log(message);
    }
  }
};

// Fonction utilitaire pour logger les erreurs (toujours sur stderr)
const safeErrorLog = (message, error) => {
  if (isStdioMode) {
    console.error(message, error?.message || error);
  } else {
    console.error(message, error);
  }
};

// Métadonnées MCP
const metadata = {
  name: 'google-places-photos',
  version: '1.0.0',
  description: 'Récupère des photos de lieux à partir de l\'API Google Places',
  author: 'TimHub88',
  protocol: 'jsonrpc',
  protocolVersion: '2.0'
};

// Liste des outils disponibles
const tools = [
  {
    name: 'searchPlaces',
    description: 'Recherche des lieux et récupère leurs références de photos',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Terme de recherche (ex: "Eiffel Tower")',
        },
      },
      required: ['query'],
    },
    returns: {
      type: 'object',
      properties: {
        places: {
          type: 'array',
          items: {
            type: 'object'
          }
        }
      }
    }
  },
  {
    name: 'getPlacePhoto',
    description: 'Récupère l\'URL d\'une photo à partir d\'une référence Google Places',
    parameters: {
      type: 'object',
      properties: {
        photo_reference: {
          type: 'string',
          description: 'Référence de la photo Google Places',
        },
        maxwidth: {
          type: 'number',
          description: 'Largeur maximale de l\'image (par défaut 400)',
        },
      },
      required: ['photo_reference'],
    },
    returns: {
      type: 'object',
      properties: {
        photoUrl: {
          type: 'string',
          description: 'URL de la photo'
        }
      }
    }
  },
];

// Gestionnaire de méthodes JSON-RPC
const methods = {
  // Méthode d'initialisation MCP
  initialize: async () => {
    safeLog("Initialize method called");
    return {
      status: 'success',
      metadata,
    };
  },

  // Méthode pour lister les outils disponibles
  'tools/list': async () => {
    safeLog("Tools/list method called");
    return {
      status: 'success',
      tools,
    };
  },

  // Méthode pour exécuter un outil
  'tools/execute': async (params) => {
    try {
      // Sécuriser le logging des paramètres pour éviter les erreurs de parse JSON
      if (!isStdioMode) {
        safeLog("Tools/execute method called with tool:", params?.tool || "undefined");
      }
      
      const { tool, params: toolParams } = params || {};

      if (!tool) {
        return {
          status: 'error',
          error: {
            message: 'Tool name is required',
          },
        };
      }

      // Exécuter l'outil demandé
      let result;
      
      switch (tool) {
        case 'searchPlaces':
          result = await placesController.executeSearchPlaces(toolParams);
          break;
        case 'getPlacePhoto':
          result = await placesController.executeGetPlacePhoto(toolParams);
          break;
        default:
          return {
            status: 'error',
            error: {
              message: `Unknown tool: ${tool}`,
            },
          };
      }

      return {
        status: 'success',
        result,
      };
    } catch (error) {
      safeErrorLog(`Error executing tool:`, error);
      return {
        status: 'error',
        error: {
          message: error.message || 'Internal server error',
        },
      };
    }
  },
};

// Gestionnaire JSON-RPC
const handleJsonRpc = async (req, res) => {
  try {
    // Si la requête est vide ou non valide
    if (!req.body || typeof req.body !== 'object') {
      safeErrorLog("Invalid request body:", req.body);
      return res.status(400).json({
        jsonrpc: '2.0',
        error: {
          code: -32600,
          message: 'Invalid Request: Empty or invalid body',
        },
        id: null,
      });
    }
    
    const { jsonrpc, method, params, id } = req.body;

    // Vérifier que la requête est une requête JSON-RPC 2.0 valide
    if (jsonrpc !== '2.0') {
      safeErrorLog("Invalid JSON-RPC version:", jsonrpc);
      return res.json({
        jsonrpc: '2.0',
        error: {
          code: -32600,
          message: 'Invalid Request: Expected JSON-RPC 2.0',
        },
        id: id || null,
      });
    }

    // Vérifier que la méthode existe
    if (!method || !methods[method]) {
      safeErrorLog("Method not found:", method);
      return res.json({
        jsonrpc: '2.0',
        error: {
          code: -32601,
          message: `Method not found: ${method}`,
        },
        id: id || null,
      });
    }

    // Exécuter la méthode et récupérer le résultat
    const result = await methods[method](params || {});

    // Envoyer la réponse
    return res.json({
      jsonrpc: '2.0',
      result,
      id,
    });
  } catch (error) {
    safeErrorLog(`Error handling JSON-RPC request:`, error);
    return res.json({
      jsonrpc: '2.0',
      error: {
        code: -32603,
        message: 'Internal error',
        data: error.message,
      },
      id: req.body?.id || null,
    });
  }
};

module.exports = {
  handleJsonRpc,
  metadata,
  tools
};