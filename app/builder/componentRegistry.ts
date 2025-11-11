import { AvailableComponent } from './components';

class ComponentRegistry {
  private components: Map<string, AvailableComponent> = new Map();
  private categories: Map<string, AvailableComponent[]> = new Map();

  registerComponent(component: AvailableComponent) {
    this.components.set(component.id, component);
    if (!this.categories.has(component.category)) {
      this.categories.set(component.category, []);
    }
    this.categories.get(component.category)!.push(component);
  }

  registerComponents(components: AvailableComponent[]) {
    components.forEach((component) => this.registerComponent(component));
  }

  getComponent(id: string): AvailableComponent | undefined {
    return this.components.get(id);
  }

  getComponentsByCategory(category: string): AvailableComponent[] {
    return this.categories.get(category) || [];
  }

  getAllCategories(): string[] {
    return Array.from(this.categories.keys());
  }

  getAllComponents(): AvailableComponent[] {
    return Array.from(this.components.values());
  }

  findComponentByType(type: string): AvailableComponent | undefined {
    return Array.from(this.components.values()).find((comp) => comp.type === type);
  }
}

export const componentRegistry = new ComponentRegistry();
