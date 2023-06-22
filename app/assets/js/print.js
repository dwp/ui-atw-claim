document.getElementById('print-link')
  .addEventListener('click', (event) => {
    event.preventDefault();
    return window.print();
  });
