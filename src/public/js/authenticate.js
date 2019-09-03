(async () => {
    let response = await fetch(`${document.location.origin}/authenticate${document.location.search}`);

    if (response.status != 200) return document.write(await response.text());

    document.write(await response.text());
})();