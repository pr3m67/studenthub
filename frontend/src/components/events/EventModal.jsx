import Modal from "../common/Modal";
import CountdownTimer from "../common/CountdownTimer";

export default function EventModal({ open, onClose, event }) {
  return (
    <Modal open={open} onClose={onClose} title={event?.title || "Event"}>
      {event ? (
        <div className="space-y-4">
          <div className="h-52 rounded-3xl bg-gradient-to-br from-sand to-sage/30" style={event.image_url ? { backgroundImage: `url(${event.image_url})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined} />
          <p className="text-sm text-slate-500">{event.venue} • <CountdownTimer target={event.date} /></p>
          <p>{event.description}</p>
        </div>
      ) : null}
    </Modal>
  );
}
