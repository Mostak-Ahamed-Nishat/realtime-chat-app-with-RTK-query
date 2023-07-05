export default function getPartnerInfo(
    participants,
    email
) {
 
    return participants.find((participant) =>
        participant.email !== email
    )
}