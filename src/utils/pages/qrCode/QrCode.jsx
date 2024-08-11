import React, { useEffect, useRef, useState } from "react";
import QrFrame from "../../assets/qr-frame.svg";
import QrScanner from "qr-scanner";
import style from "./QrCode.module.css";
import { toast } from "react-toastify";

const QrCode = () => {
    const scanner = useRef(null);
    const videoEl = useRef(null);
    const qrBoxEl = useRef(null);
    const [qrOn, setQrOn] = useState(true);

    // Result
    const [scannedResult, setScannedResult] = useState("");

    const onScanSuccess = (result) => {
        toast(result.data);
        setScannedResult(result?.data);
    };

    const onScanFail = (err) => {
        console.log(err);
    };

    useEffect(() => {
        const initializeScanner = async () => {
            if (videoEl?.current && !scanner.current) {
                // 👉 Instantiate the QR Scanner
                scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
                    onDecodeError: onScanFail,
                    preferredCamera: "environment",
                    // 🖼 This will help us position our "QrFrame.svg" so that user can only scan when qr code is put in between our QrFrame.svg.
                    highlightScanRegion: true,
                    // 🔥 This will produce a yellow (default color) outline around the qr code that we scan, showing a proof that our qr-scanner is scanning that qr code.
                    highlightCodeOutline: true,
                    // 📦 A custom div which will pair with "highlightScanRegion" option above 👆. This gives us full control over our scan region.
                    overlay: qrBoxEl?.current || undefined,
                });

                // 🚀 Start QR Scanner
                scanner?.current
                    ?.start()
                    .then(() => {
                        setQrOn(true)
                    })
                    .catch((err) => {
                        if (err) setQrOn(false);
                    });
            }
        };

        initializeScanner();

        // 🧹 Clean up on unmount.
        // 🚨 This removes the QR Scanner from rendering and using camera when it is closed or removed from the UI.
        return () => {
            if (!videoEl?.current) {
                scanner?.current?.stop();
            }
        };
    }, []);

    // ❌ If "camera" is not allowed in browser permissions, show an alert.
    useEffect(() => {
        if (!qrOn)
            alert(
                "Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload."
            );
    }, [qrOn]);

    return (
        <div className={style["qr-reader"]}>
            {/* QR */}
            <video ref={videoEl}></video>
            <div ref={qrBoxEl} className="qr-box">
                <img
                    src={QrFrame}
                    alt="Qr Frame"
                    width={256}
                    height={256}
                    className={style["qr-frame"]}
                />
            </div>
        </div>
    );
};

export default QrCode;