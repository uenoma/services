import './ProgressContent.css';
import progressImage from "./images/progress.png"

function ProgressContent(props) {

  return (
    <div className="ProgressContent">
      <img className="ProgressContentImage" src={progressImage} alt="" />
      <div className="ProgressContentCaption">Now Loading...</div>
    </div>
  );
}

export default ProgressContent;
