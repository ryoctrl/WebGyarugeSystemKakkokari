window.addEventListener('load', loaded);

function loaded() {
    const updateIdEl = document.getElementById('serif-id');
    updateIdEl.disabled = true;

    const updateToggleEl = document.getElementById('update');
    updateToggleEl.addEventListener('change', function() {
        updateIdEl.disabled = !updateToggleEl.checked;
    });

}
