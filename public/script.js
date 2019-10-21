(function(){
    const XHR = window['web-http'].HTTP;
    const xhr = new XHR({
        baseUrl: `https://my-json-server.typicode.com/dharmendra205111014/fakeJson/comments`,
    })

    // xhr.get('1').then(res => console.log(res.data));
    // xhr.post('1').then(res => console.log(res.data));
    // xhr.put('1').then(res => console.log(res.data));
    // xhr.patch('1').then(res => console.log(res.data));
    // xhr.delete('1').then(res => console.log(res.data));

    let buttons = document.querySelector('.buttons');

    buttons.addEventListener('click', (e) => {
        console.log('calling ', e.target.dataset.method);
        const method = e.target.dataset.method;
        if(method !== 'post'){
            xhr[e.target.dataset.method]('1').then(res => console.log(res.data));
        } else {
            xhr.post('', { "id": 3, "body": "some comment 3", "postId": 1 }).then(res => console.log(res.data));
        }
    }, true);

})();