export default class Position {
  constructor(lat, long) {
    this.lat = lat;
    this.long = long;
  }

  static getCoordinates() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }

  static async getPosition() {
    // wait for the resolved result
    let position;
    try {
      position = await Position.getCoordinates();
    } catch {
      console.log('position wrong');
      throw new Error();
    }
    const { latitude, longitude } = position.coords;
    console.log(`lat ${latitude}`);
    console.log(`long ${longitude}`);
    return new Position(latitude, longitude);
  }

  static coordsPattern = /([-+]?\d+\.\d+),\s*([-+]?\d+\.\d+)/;

  // check input of coordinates
  // if it's ok, return new Position element with this coordinates
  static checkCoords(text) {
    let latitude;
    let longitude;

    const match = text.match(Position.coordsPattern);
    if (match) {
      latitude = match[1];
      longitude = match[2];

      return new Position(latitude, longitude);
    }

    throw new Error('Wrong format coordinates. It must be: number, number');
  }
}
