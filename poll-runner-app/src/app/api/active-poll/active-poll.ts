export class ActivePoll {
    id?: string;
    poll_id: string;
    user_id: string;
    responses?: boolean[];
    status?: string;
    last_updated: string;
}