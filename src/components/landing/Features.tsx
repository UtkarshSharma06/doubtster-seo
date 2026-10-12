import type { CSSProperties } from "react";
import { ChalkBoard } from "./ChalkBoard";

export function Features() {
  return (
<section className="feat wrap" id="features">
  <div className="row">
    <div className="txt"><span className="bubble">doubtster</span><h3>finally get the thing</h3><p>Ask the question exactly as it's stuck in your head. You get the answer in small steps, not a wall of text.</p></div>
    <div className="shot light"><div className="in"><div className="m u">a ball is thrown at 12 m/s and takes 6 s to land. how far?</div><ul className="steps"><li><b>1</b>Horizontal speed stays constant</li><li><b>2</b>Distance = speed × time</li><li><b>3</b>12 × 6 = 72 m</li></ul></div></div>
  </div>
  <div className="row flip">
    <div className="shot light"><div className="in"><div className="chips"><span>calculus</span><span>organic chemistry</span><span>economics</span><span>python</span><span>physics</span><span>accounting</span><span>statistics</span><span>essays</span><span>your weird one</span></div></div></div>
    <div className="txt"><span className="bubble">doubtster</span><h3>ask anything you're studying</h3><p>Maths, science, economics, coding and more. Chat is always free, so asking never costs you a credit.</p></div>
  </div>
  <div className="row">
    <div className="txt"><span className="bubble">doubtster</span><h3>then watch it explained</h3><p>Turn any answer into a short video that draws the working out, scene by scene, when reading isn't clicking.</p></div>
    <ChalkBoard variant="accel" id="cb2" /></div>
</section>

  );
}
