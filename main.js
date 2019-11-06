function on_receive(){
    Swal.fire({
      type: "error",
      title: "Oops...",
      text: "This function still on it's way to finish!",
    });
}


function on_transfer(){
    (async () => {
        const { value: text } = await Swal.fire({
          title: '想要轉出多少 QCoin',
          input: 'text',
          inputPlaceholder: '10',
          showCancelButton: true,
          inputValidator: (value) => {
            if (!value) {
              return '金額不能空白'
            } else {
                var parsed = parseInt(value);
                if (isNaN(parsed)) {
                    parsed = 0;
                }

                if( parsed <= 0 ){
                    return '轉帳金額必須大於 $0 QCoin';
                }
            }
          }
        })

        if (text) {
            // Create QR Code
            data  = create_transfer_data( text );
            base64 = base64_encode(data);
            qr = mkQRCode(base64);
            Swal.fire({
               title: '[我的轉帳條碼]',
               text: '***QCoin 即將轉出，請小心勿輕易展示本畫面，請前往攤位掃描以進行轉帳***',
              imageUrl: qr
            })
        }
    })();
}

function mkQRCode( data ){
    var qr = new QRious({
          value: data,
          size: 500,
    });
    return qr.toDataURL();
}

function on_scan(){
	window.location.href = "Scan.html";
}

function base64_encode( obj ){

    hint = "How to calculate checksum?";
    obj.hint = hint;

    _tmp = JSON.stringify(obj);
    len_remain = _tmp.length % 3;
    obj.hint += " ".repeat(4-len_remain);
    _tmp = JSON.stringify(obj);

    return btoa(_tmp);

}

function create_transfer_data( amount ){
    amount = amount.toString();
    cs_account_number = calc_checksum(ACCOUNT_NUMBER);
    cs_amount = calc_checksum(amount);
    cs_final = cs_account_number + cs_amount;

    pack = {
        account_number: ACCOUNT_NUMBER,
        amount: amount,
        checksum: cs_final
    };

    return pack;
}

function calc_checksum( data ){

    let sign = +1;
    let digi_sum = 0;

    if( data.length < 1 ){
        return NaN;
    }

    if( data[0] == '-' ){
        sign = -1;
    }

    i=0;
    if( data[0] == '-' || data[0] == '+' ){
        i++;
    }

    for(; i<data.length; i++){
        let parsed = parseInt(data[i]);
        if (isNaN(parsed)) {parsed = 0;}
        digi_sum += parsed;
    }

    return sign * digi_sum;

}
