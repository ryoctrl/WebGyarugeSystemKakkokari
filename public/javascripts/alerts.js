function displayAlert(message, isError) {
    if(isError) {
        alertify.error(message);
    } else {
        alertify.success(message);
    }
}
