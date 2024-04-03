from setuptools import setup, find_packages

setup(
    name='scocli',
    version='0.1',
    author= 'Vasapg',
    description= 'CLI to facilitate the creation and managing of SCORM packages',
    url='https://github.com/Vasapg/SCO/tree/main',
    packages=find_packages(),
    entry_points={
        'console_scripts': [
            'scoaddResource = sco.addResource:main',
            'scoremoveResource = sco.removeResource:main',
            'scoseeManifest = sco.seeManifest:main',
            'scobuild = sco.build:main',
        ],
    }
)
