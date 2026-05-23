function Modal({ children, isOpen, onClose, title }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section
        aria-modal="true"
        className="modal"
        role="dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{title}</h2>
          <button type="button" aria-label="Close modal" onClick={onClose}>
            X
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </section>
    </div>
  );
}

export default Modal;
