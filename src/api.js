const AUTHORIZATION = 'Basic YANA-BIG-TRIP2-2026-20-06';
const END_POINT = 'https://22.objects.htmlacademy.pro/big-trip';

export default class ApiService {
  #endPoint = END_POINT;
  #authorization = AUTHORIZATION;

  async loadPoints() {
    return this.#load('/points');
  }

  async loadDestinations() {
    return this.#load('/destinations');
  }

  async loadOffers() {
    return this.#load('/offers');
  }

  async updatePoint(point) {
    return this.#load(`/points/${point.id}`, {
      method: 'PUT',
      body: JSON.stringify(point),
    });
  }

  async addPoint(point) {
    return this.#load('/points', {
      method: 'POST',
      body: JSON.stringify(point),
    });
  }

  async deletePoint(point) {
    return this.#load(`/points/${point.id}`, {
      method: 'DELETE',
    });
  }

  async #load(url, options = {}) {
    const response = await fetch(`${this.#endPoint}${url}`, {
      ...options,
      headers: {
        Authorization: this.#authorization,
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status} ${response.statusText}`);
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  }
}
