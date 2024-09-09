from setuptools import setup, find_packages

setup(
    name="lm-benchmark",
    version="0.1.1",
    packages=find_packages(),
    install_requires=[
        "aiohttp",
        "numpy",
        "matplotlib",
        "pandas",
        "openpyxl",
        "typer",
        "speedtest-cli",
        "GPUtil"
    ],
    entry_points={
        "console_scripts": [
            "lm-benchmark=lm_benchmark.lm_benchmark:main",
        ],
    },
    include_package_data=True,
    package_data={
        "lm_benchmark": ["databricks-dolly-15k.jsonl"],
    },
)