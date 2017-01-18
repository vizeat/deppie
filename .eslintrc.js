module.exports = {
    "extends": "airbnb",
    "rules": {
        "comma-dangle": [
          "error",
          {
            "arrays": "always-multiline",
            "objects": "always-multiline",
            "imports": "always-multiline",
            "exports": "always-multiline",
            "functions": "never"
          }
        ],
        "indent": ["error", 4],
        "no-console": 0,
        "no-shadow": 0,
    },
    "globals": {
        "describe": true,
        "it": true
    }
}
