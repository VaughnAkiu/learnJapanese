// this is not grabbed from database but created from two tables
type UserWordMap = {
    // used for keys?
    word_object_id: number
    kanji: string
    pronounciation: string
    translation: string
    example: string
    example_translation: string
    learning: boolean
    learned: boolean
    // user_id: number
};

export default UserWordMap;
