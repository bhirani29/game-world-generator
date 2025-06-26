import torch
import torch.nn as nn
import torch.jit

class TerrainModel(nn.Module):
    def __init__(self):
        super(TerrainModel, self).__init__()
        self.fc = nn.Linear(1, 1)
        # Initialize weights to encourage varied outputs
        nn.init.uniform_(self.fc.weight, -1.0, 1.0)
        nn.init.uniform_(self.fc.bias, -0.5, 0.5)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return torch.sigmoid(self.fc(x))

    @torch.jit.export
    def adapt(self, player_input: torch.Tensor) -> None:
        with torch.no_grad():
            self.fc.weight.add_(0.01 * player_input)  # Adaptive update
            self.fc.bias.add_(0.01 * player_input)

# Save model as TorchScript
model = TerrainModel()
scripted_model = torch.jit.script(model)
scripted_model.save("terrain_model.pt")