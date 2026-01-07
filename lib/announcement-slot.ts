export enum AnnouncementStatus {
    PIN = 'pin',
    UNPINNED = 'unpinned',
}

export default interface AnnouncementSlot {
    id : number ;
    profile : string ;
    name : string ;
    content : string ;
    date : Date ;
    status : AnnouncementStatus ;
}