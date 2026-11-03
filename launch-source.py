import sys
from vidaa.cli import main
from vidaa.topics import SOURCE_MAP

# This TV uses named source IDs rather than the library's numeric defaults.
SOURCE_MAP.update({f"hdmi{number}": f"HDMI{number}" for number in (1, 2, 3)})

if __name__ == "__main__":
    sys.exit(main())
