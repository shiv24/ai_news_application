import logging
import os
from typing import Any, Optional, Union


SRC_ROOT = os.path.dirname(os.path.abspath(__file__))


class SrcRelativeFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        try:
            relative_path = os.path.relpath(record.pathname, start=SRC_ROOT)
        except ValueError:
            relative_path = record.pathname

        record.src_location = f"{relative_path}:{record.lineno}"
        return super().format(record)


class AppLogger:
    def __init__(
        self,
        name: str = "ai_news_application",
        level: Optional[Union[str, int]] = None,
    ):
        self._logger = logging.getLogger(name)
        self._logger.setLevel(self._resolve_level(level))
        self._logger.propagate = False

        if not self._logger.handlers:
            handler = logging.StreamHandler()
            handler.setFormatter(
                SrcRelativeFormatter("%(asctime)s [%(src_location)s] %(message)s")
            )
            self._logger.addHandler(handler)

    def _resolve_level(self, level: Optional[Union[str, int]]) -> int:
        if isinstance(level, int):
            return level

        level_name = (level or os.getenv("LOG_LEVEL", "INFO")).upper()
        return getattr(logging, level_name, logging.INFO)

    def debug(self, message: str, *args: Any, **kwargs: Any) -> None:
        kwargs.setdefault("stacklevel", 2)
        self._logger.debug(message, *args, **kwargs)

    def info(self, message: str, *args: Any, **kwargs: Any) -> None:
        kwargs.setdefault("stacklevel", 2)
        self._logger.info(message, *args, **kwargs)

    def warning(self, message: str, *args: Any, **kwargs: Any) -> None:
        kwargs.setdefault("stacklevel", 2)
        self._logger.warning(message, *args, **kwargs)

    def error(self, message: str, *args: Any, **kwargs: Any) -> None:
        kwargs.setdefault("stacklevel", 2)
        self._logger.error(message, *args, **kwargs)

    def exception(self, message: str, *args: Any, **kwargs: Any) -> None:
        kwargs.setdefault("stacklevel", 2)
        self._logger.exception(message, *args, **kwargs)

    def critical(self, message: str, *args: Any, **kwargs: Any) -> None:
        kwargs.setdefault("stacklevel", 2)
        self._logger.critical(message, *args, **kwargs)

    def get_child(self, name: str) -> logging.Logger:
        return self._logger.getChild(name)


logger = AppLogger()
