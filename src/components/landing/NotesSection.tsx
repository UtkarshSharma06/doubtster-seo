import { NotesViewer } from "./NotesViewer";

export function NotesSection() {
  return (
<section className="nts wrap" id="notes">
  <div className="nhead"><span className="bubble">doubtster</span><h3>structured notes, with the diagram</h3><p>Ask once and get clean notes with the diagram that goes with them, plus flashcards from the same page. Biology, chemistry, physics, coding and more.</p></div>
  <NotesViewer />
  <p className="ill">Illustrative example of a generated note. AI notes can contain mistakes, so check important facts with your teacher.</p>
</section>

  );
}
