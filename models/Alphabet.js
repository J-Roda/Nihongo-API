const mongoose = require("mongoose");

const { Schema } = mongoose;

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
    // partner of mode: main is this group
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
    // partner of mode: 'combination' is this group
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
    // partner of mode: 'dakuten' is this group
    const defaultDakutenGroup = ["ba", "da", "za", "ga", "pa"];
    // all groups combined
    const defaultGroups = [
        ...defaultMainGroup,
        ...defaultCombinationGroup,
        ...defaultDakutenGroup,
    ];
    const defaultType = ["hiragana", "katakana"];
    const defaultModes = ["main", "combination", "dakuten"];

    // Check if type entered is correct if not return what user has been inputted
    const errorType = !defaultType.includes(lowerCaseType) && lowerCaseType;

    // Check if mode entered is correct if not return what user has been inputted
    const errorMode = lowerCaseMode
        .map((mode) => (defaultModes.includes(mode) ? true : mode))
        .filter((m) => m !== true)
        .at(0);

    const errorGroup = lowerCaseGroup
        .map((group) => (defaultGroups.includes(group) ? true : group))
        .filter((g) => g !== true)
        .at(0);

    // check if group entered is the right partner for mode: 'main'
    const errorMainGroup = lowerCaseGroup
        .map((mg) => (defaultMainGroup.includes(mg) ? true : mg))
        .filter((mg) => mg !== true)
        .at(0);

    // check if group entered is the right partner for mode: 'main'
    const errorCombinationGroup = lowerCaseGroup
        .map((cg) => (defaultCombinationGroup.includes(cg) ? true : cg))
        .filter((cg) => cg !== true)
        .at(0);

    // check if group entered is the right partner for mode: 'dakuten'
    const errorDakutenGroup = lowerCaseGroup
        .map((dg) => (defaultDakutenGroup.includes(dg) ? true : dg))
        .filter((dg) => dg !== true)
        .at(0);

    // check if the inputted type has same values in the default types
    const acceptedTypes = defaultType.includes(lowerCaseType);

    // check if the inputted mode has same values in the default modes
    const acceptedModes = lowerCaseMode.every((mode) =>
        defaultModes.includes(mode)
    );

    const acceptedGroup = lowerCaseGroup.every((group) =>
        defaultGroups.includes(group)
    );

    // check if the inputted group is right partner for mode: 'main'
    const acceptedMainGroup = lowerCaseGroup.every((g) =>
        defaultMainGroup.includes(g)
    );

    // check if the inputted group is right partner for mode: 'combination'
    const acceptedCombinationGroup = lowerCaseGroup.every((g) =>
        defaultCombinationGroup.includes(g)
    );

    // check if the inputted group is right partner for mode: 'dakuten'
    const acceptedDakutenGroup = lowerCaseGroup.every((g) =>
        defaultDakutenGroup.includes(g)
    );

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

    if (!acceptedMainGroup && mode.includes("main") && mode.length === 1)
        throw Error(
            `group: ${errorMainGroup} is not valid, Please select this choices { ${defaultMainGroup} }`
        );

    if (
        !acceptedCombinationGroup &&
        mode.includes("combination") &&
        mode.length === 1
    )
        throw Error(
            `group: ${errorCombinationGroup} is not valid, Please select this choices { ${defaultCombinationGroup} }`
        );

    if (!acceptedDakutenGroup && mode.includes("dakuten") && mode.length === 1)
        throw Error(
            `group: ${errorDakutenGroup} is not valid, Please select this choices { ${defaultDakutenGroup} }`
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
