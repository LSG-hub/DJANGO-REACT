import "../styles/LoadingIndicator.css";

const LoadingIndicator = ({ size = "default" }) => {
    return (
        <div className={`loading-container ${size}`}>
            <div className={`loader ${size}`}></div>
        </div>
    );
};

export default LoadingIndicator;