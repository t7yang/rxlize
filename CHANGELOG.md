# Rxlize Change Log

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [0.1.0] - 2020-09-13
### Changed
- `rxAsync` and `rxNext` receive a observable operator function instead of RxlFactory function at second argument.

### Fixed
- `rxStore` now create a new observable in reset instead of use the same one.

## [0.0.6] - 2020-09-10
### Fixed
- The build config for babel and rollup are now setup correctly, bundle files are working fine in module and browswer.
- Unpublish 0.0.3 to 0.0.5, due build configs are not setup properly.

## [0.0.5] - 2020-09-10 (UNPUBLISH)
### Fixed
- Add output.globals for iife build in rollup config.
- `RxlAsyncState.data` is not longer optional in `rxStore`.

## [0.0.4] - 2020-09-10 (UNPUBLISH)
### Fixed
- Add output.globals for iife build in rollup config.

## [0.0.3] - 2020-09-10 (UNPUBLISH)
### Fixed
- The data property of RxlAsyncState in rxStore should not be optional

### Changed
- Add cautions section in readme.

## [0.0.2] - 2020-09-09
### Fixed
- Make rxjs as external resource and move it to peerDependencies to avoid potential types error.

## [0.0.1] - 2020-09-09
- Initial release
