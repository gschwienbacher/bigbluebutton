package org.bigbluebutton.core.db

import org.bigbluebutton.common2.domain.{ GroupProps }
import PostgresProfile.api._
import slick.lifted.{ ProvenShape }

case class MeetingGroupDbModel(
    meetingId:  String,
    groupId:    String,
    name:       String,
    usersExtId: List[String]
)

class MeetingGroupDbTableDef(tag: Tag) extends Table[MeetingGroupDbModel](tag, None, "meeting_group") {
  val meetingId = column[String]("meetingId", O.PrimaryKey)
  val groupId = column[String]("groupId", O.PrimaryKey)
  val name = column[String]("name")
  val usersExtId = column[List[String]]("usersExtId", O.SqlType("varchar[]"))

  //  def fk_meetingId: ForeignKeyQuery[MeetingDbTableDef, MeetingDbModel] = foreignKey("fk_meetingId", meetingId, TableQuery[MeetingDbTableDef])(_.meetingId)

  override def * : ProvenShape[MeetingGroupDbModel] = (meetingId, groupId, name, usersExtId) <> (MeetingGroupDbModel.tupled, MeetingGroupDbModel.unapply)
}

object MeetingGroupDAO {
  def insert(meetingId: String, groups: Vector[GroupProps]) = {
    DatabaseConnection.enqueue(DBIO.sequence(
      for {
        group <- groups
      } yield {
        TableQuery[MeetingGroupDbTableDef].insertOrUpdate(
          MeetingGroupDbModel(
            meetingId = meetingId,
            groupId = group.groupId,
            name = group.name,
            usersExtId = group.usersExtId.toList
          )
        )
      }
    ).transactionally)
  }
}