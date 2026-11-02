// Props that connect an input to its error message for assistive technology.
// Spread the result onto an <input>, <select> or <textarea>.
export function fieldProps(id, error) {
  return {
    id,
    className: `form-control ${error ? 'is-invalid' : ''}`,
    'aria-invalid': error ? 'true' : 'false',
    'aria-describedby': error ? `${id}-error` : undefined,
  }
}
