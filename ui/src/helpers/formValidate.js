export function fromValidate(formEl) {
    const formLength = formEl.length;
    let invalidationEle = {};
    if (formEl.checkValidity() === false) {
      for (let i = 0; i < formLength; i++) {
        const elem = formEl[i];
        if (!elem.validity.valid) {
          invalidationEle[elem.name] = elem.validity;
        }
      }
      return { valid: false, invalidationEle: invalidationEle };
    }
    else {
      return { valid: true, invalidationEle: invalidationEle };
    }
}
