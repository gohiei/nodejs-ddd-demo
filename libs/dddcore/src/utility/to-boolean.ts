export function toBoolean(val) {
  if (typeof val === 'undefined' || val === null) {
    return;
  }

  if (typeof val === 'string') {
    if (val === 'false') {
      return false;
    }

    return !!val;
  }

  return !!val;
}
