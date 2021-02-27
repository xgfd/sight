import json
import shlex
from engine import run, ls, _parse_and_exec, export


def test_ls():
    print(ls())


def test_run():

    cmd_input = json.dumps(
        [
            {"fn": "builtin.imread", "rid": "0", "args": ["test.png", 0]},
            {"fn": "builtin.Canny", "rid": "1", "args": [[80, 120], 3, False]},
            {"fn": "builtin.imread", "rid": "2", "args": ["test.png", 0]},
        ]
    )
    run(cmd_input)
    cmd_input = json.dumps(
        [
            {
                "fn": "builtin.Canny",
                "last_hash": "2c3c4270da43daa9dcf21057839d0a7e05e4d19527598fcd914cd39741b5bd4a",
                "rid": "canny-1",
                "args": [[80, 120], 3, False],
            },
            {
                "fn": "builtin.bitwise_and",
                "rid": "bitwiseand-2",
                "extra_inputs": [
                    "2c3c4270da43daa9dcf21057839d0a7e05e4d19527598fcd914cd39741b5bd4a"
                ],
                "args": [],
            },
            {"fn": "builtin.imread", "rid": "0", "args": ["test.png", 0]},
            {
                "fn": "builtin.bitwise_or",
                "rid": "bitwiseor-3",
                "extra_inputs": [0],
                "args": [],
            },
        ]
    )
    run(cmd_input)


def test_export():
    operations = [
        {
            "fn": "builtin.imread",
            "rid": "af4385ad-cba5-4746-8400-eae3ee5b2988",
            "args": ["", 0],
            "extra_inputs": [],
        },
        {
            "fn": "builtin.GaussianBlur",
            "rid": "822ca78c-ddda-49c2-8ad6-eb639a413e08",
            "args": [3, 3, 0, 0, 4],
            "extra_inputs": [],
        },
        {
            "fn": "builtin.threshold",
            "rid": "e0bca777-b41a-4133-bbc0-6cdd439c7e33",
            "args": [127, 255, 0],
            "extra_inputs": [],
        },
        {
            "fn": "builtin.bitwise_and",
            "rid": "3ea1682c-2943-4ebe-9559-c2a842a3e8fa",
            "args": [],
            "extra_inputs": ["822ca78c-ddda-49c2-8ad6-eb639a413e08"],
        },
        {
            "fn": "builtin.morphologyEx",
            "rid": "6ae3548c-31c4-4ce8-8c64-813d1c484698",
            "args": [0, 3, 3, 0],
            "extra_inputs": [],
        },
        {
            "fn": "builtin.findContours",
            "rid": "dc907f52-cc01-4329-ba2a-30ea466b865b",
            "args": [3, 2, 2, 1],
            "extra_inputs": [],
        },
        {
            "fn": "builtin.filterContours",
            "rid": "3be9a614-ffaf-4d24-afa2-b0edb3dbd3f6",
            "args": [
                [25, 5000000],
                [25, 5000000],
                [5, 3000],
                [0.01, 1],
                [0, 128],
                2,
                1,
            ],
            "extra_inputs": [],
        },
        {
            "fn": "builtin.bitwise_or",
            "rid": "ac148d38-9aa5-4c26-8432-d789720f27c2",
            "args": [],
            "extra_inputs": ["dc907f52-cc01-4329-ba2a-30ea466b865b"],
        },
    ]

    export(json.dumps(operations))


def test_parse_and_exec():
    instructions = [
        {"fn": "builtin.imread", "rid": "0", "args": ["test.png", 0]},
        {"fn": "builtin.Canny", "rid": "1", "args": [[80, 120], 3, False]},
        {"fn": "builtin.imread", "rid": "2", "args": ["test.png", 0]},
    ]
    cmd = shlex.join(["run", json.dumps(instructions)])
    print("cmd", cmd)
    _parse_and_exec(cmd)

    cmd = 'upsert "custom.custom1"'
    print("cmd", cmd)
    _parse_and_exec(cmd)


if __name__ == "__main__":
    # test_ls()
    # test_run()
    # test_parse_and_exec()
    test_export()
