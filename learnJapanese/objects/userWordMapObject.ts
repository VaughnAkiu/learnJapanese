// this is not grabbed from database but created from two tables
type UserWordMap = {
    // used for keys?
    word_object_id: number
    kanji: string
    pronounciation: string
    translation: string
    learning: boolean
    learned: boolean
};

export default UserWordMap;
