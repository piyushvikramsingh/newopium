{ pkgs, ... }:
{
  channel = "stable-24.05";

  packages = [
    pkgs.nodejs_20
    pkgs.nodePackages.npm
  ];

  env = {
    NODE_ENV = "development";
  };

  idx = {
    extensions = [
      "dbaeumer.vscode-eslint"
      "esbenp.prettier-vscode"
    ];

    previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm" "run" "dev" "--" "--host" "0.0.0.0" "--port" "$PORT"];
          manager = "web";
          env = {
            PORT = "$PORT";
          };
        };
      };
    };
  };
}
