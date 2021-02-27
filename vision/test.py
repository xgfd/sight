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
        {"fn": "builtin.GaussianBlur", "args": [3, 3, 0, 0, 0]},
        {
            "fn": "builtin.circleROI",
            "args": [
                3,
                2,
                [1000000, 1500000],
                0.6,
                2,
                1,
            ],
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
    test_run()
    # test_parse_and_exec()
    # test_export()
