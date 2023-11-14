const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const alphabetSchema = new Schema({
    hiragana: {
        type: String,
    },
    katakana: {
        type: String,
    },
    romaji: {
        type: String,
    },
    mode: {
        type: String,
    },
    group: {
        type: String,
    },
});

alphabetSchema.statics.selectKana = async function (data) {
    const { mode, group, type } = data;

    if (!mode || !group || !type)
        throw Error("Please put what 'mode', 'group' and 'type'");

    const lowerCaseMode = mode.map((m) => m.toLowerCase());
    const lowerCaseGroup = group.map((m) => m.toLowerCase());
    const lowerCaseType = type.toLowerCase();
    const defaultType = ["hiragana", "katakana"];
    const defaultModes = ["main", "combination", "dakuten"];
    const defaultMainGroup = [
        "a",
        "ka",
        "sa",
        "ta",
        "na",
        "ha",
        "ma",
        "ya",
        "ra",
        "wa",
    ];
    const defaultCombinationGroup = [
        "nya",
        "cha",
        "sha",
        "kya",
        "gya",
        "rya",
        "mya",
        "hya",
        "pya",
        "bya",
        "ja",
        "dya",
    ];
    const defaultDakutenGroup = ["ba", "da", "za", "ga", "pa"];
    const defaultGroups = [
        ...defaultMainGroup,
        ...defaultCombinationGroup,
        ...defaultDakutenGroup,
    ];

    // Get what error user has been made
    const errorType = !defaultType.includes(lowerCaseType) && lowerCaseType;

    const errorMode = lowerCaseMode
        .map((mode) => (defaultModes.includes(mode) ? true : mode))
        .filter((m) => m !== true)
        .at(0);

    const errorGroup = lowerCaseGroup
        .map((group) => (defaultGroups.includes(group) ? true : group))
        .filter((g) => g !== true)
        .at(0);

    // check if the inputted mode has same values in the default modes
    const acceptedTypes = defaultType.includes(lowerCaseType);

    const acceptedModes = lowerCaseMode.every((mode) =>
        defaultModes.includes(mode)
    );

    const acceptedGroup = lowerCaseGroup.every((group) =>
        defaultGroups.includes(group)
    );

    const acceptedMainGroup =
        mode.includes("main") && defaultMainGroup.includes(group);

    console.log(acceptedMainGroup);

    if (!acceptedTypes)
        throw Error(
            `type: ${errorType} is not valid, Please select this choices { ${defaultType} }`
        );

    if (!acceptedModes)
        throw Error(
            `mode: ${errorMode} is not valid, Please select this choices { ${defaultModes} }`
        );

    if (!acceptedGroup)
        throw Error(
            `group: ${errorGroup} is not valid, Please select this choices { ${defaultGroups} }`
        );

    const selectedKana = await this.find({
        mode: { $in: mode },
        group: { $in: group },
    }).select(`${type} romaji`);

    if (selectedKana.length === 0) {
        let error = new Error("No such type of alphabet exist!");
        error.status = 404;
        throw error;
    }

    return selectedKana;
};

module.exports = mongoose.model("Alphabet", alphabetSchema);
