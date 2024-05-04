import Position from '../poster/position';

export default class WarningShow {
  constructor(container) {
    const warningForm = document.createElement('form');
    warningForm.className = 'warning';
    warningForm.name = 'warning';
    warningForm.innerHTML = this.warningFormMarkup();
    container.insertBefore(warningForm, null);

    this.onWarningCancel = this.onWarningCancel.bind(this);
    this.onWarningSubmit = this.onWarningSubmit.bind(this);
  }

  warningFormMarkup() {
    return `
        <form class="warning" name="warning">
            <label for="warning-position">
                We're sorry.
                But something went wrong, we couldn't get your position.
                Please allow access to your position or input your position
                into field below in format: latitude, longitude.
            </label>
            <input type="text" class="warning-position" name="warning-position" id="warning-position">
            <input type="submit" value="OK" class="warning__submit">
            <input type="button" value="Cancel" class="warning__cancel">
        </form>
    `;
  }

  bindToDOM() {
    this.warningForm = document.querySelector('.warning');
    this.inputPosElem = this.warningForm.querySelector('.warning-position');
    this.cancelBtn = this.warningForm.querySelector('.warning__cancel');

    this.cancelBtn.addEventListener('click', this.onWarningCancel);
  }

  async showWarning() {
    this.warningForm.classList.toggle('warning_active');

    const pos = new Promise((resolve, reject) => {
      // create warning close handler, and call resolve in it
      this.warningForm.addEventListener('submit', (e) => {
        const position = this.onWarningSubmit(e);
        resolve(position);
      });
    });

    return await pos;
  }

  onWarningSubmit(e) {
    e.preventDefault();

    let position;
    const text = this.inputPosElem.value;
    try {
      position = Position.checkCoords(text);
      // this.currentPosition = position;
    } catch (err) {
      console.log(err);
      alert(err);
      throw new Error(err);
    }

    this.warningForm.remove();
    return position;
  }

  onWarningCancel(e) {
    this.inputPosElem.value = '';
    this.warningForm.classList.toggle('warning_active');
  }
}
