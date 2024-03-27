import { PreviewGenerator } from "./preview-generator";

export class PreviewGeneratorFactory {
  private readonly generators = new Map<string, PreviewGenerator>();

  register(mime_type: string, generator: PreviewGenerator) {
    this.generators.set(mime_type, generator);
  }

  generate(mime_type: string): PreviewGenerator | undefined {
    return this.generators.get(mime_type);
  }
}
